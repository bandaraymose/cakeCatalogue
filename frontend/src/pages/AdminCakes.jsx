import React, { useEffect, useState } from 'react';
import { getCakes, createCake, updateCake, deleteCake, uploadImage, toImageUrl } from '../api/client';
import { isAuthed } from '../api/auth';

export default function AdminCakes({ setCurrentPage }) {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    id: null,
    name: '',
    description: '',
    imageUrl: '',
    file: null,
    sizes: 'Small,Medium,Large',
    flavors: 'Vanilla',
    sizePrices: [
      { size: 'Small', price: '' },
      { size: 'Medium', price: '' },
      { size: 'Large', price: '' }
    ]
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthed()) {
      setCurrentPage('admin-login');
      return;
    }
    refresh();
  }, []);

  const refresh = () => {
    setLoading(true);
    setError('');
    getCakes()
      .then(data => setCakes(data))
      .catch(err => setError(err.message || 'Failed to load cakes'))
      .finally(() => setLoading(false));
  };

  const onEdit = (c) => {
    const sp = (c.sizePrices && c.sizePrices.length)
      ? c.sizePrices.map(p => ({ size: p.size, price: p.price }))
      : (c.sizes || []).map(s => ({ size: s, price: '' }));
    setForm({
      id: c.id,
      name: c.name,
      description: c.description,
      imageUrl: c.imageUrl,
      sizes: (c.sizes || []).join(','),
      flavors: (c.flavors || []).join(','),
      file: null,
      sizePrices: sp
    });
  };

  const resetForm = () => setForm({ id: null, name: '', description: '', imageUrl: '', file: null, sizes: 'Small,Medium,Large', flavors: 'Vanilla', sizePrices: [ { size: 'Small', price: '' }, { size: 'Medium', price: '' }, { size: 'Large', price: '' } ] });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    let imageUrl = form.imageUrl;
    // If a new file is selected, upload first
    if (form.file) {
      const up = await uploadImage(form.file);
      imageUrl = up.url || up.absoluteUrl || imageUrl;
    }

    const payload = {
      name: form.name,
      description: form.description,
      imageUrl,
      sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
      flavors: form.flavors.split(',').map(s => s.trim()).filter(Boolean),
      sizePrices: (form.sizePrices || [])
        .filter(p => p.size && p.price !== '')
        .map(p => ({ size: p.size, price: Number(p.price) })),
      rating: 4.5,
      reviews: 0
    };
    try {
      if (form.id) {
        await updateCake(form.id, payload);
      } else {
        await createCake(payload);
      }
      resetForm();
      refresh();
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this cake?')) return;
    try {
      await deleteCake(id);
      refresh();
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin: Cakes</h2>
        <div className="space-x-2">
          <button className="px-4 py-2 border rounded-lg" onClick={refresh}>Refresh</button>
          <button className="px-4 py-2 border rounded-lg" onClick={() => setCurrentPage('admin-dashboard')}>Dashboard</button>
        </div>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      {/* Form */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold mb-3">{form.id ? 'Edit Cake' : 'Create Cake'}</h3>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input className="w-full border rounded-lg p-2" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <input type="file" accept="image/*" className="w-full" onChange={async e=>{
              const file = e.target.files?.[0];
              if (file) {
                const up = await uploadImage(file);
                setForm({...form, imageUrl: up.url || up.absoluteUrl, file: null});
              }
            }} />
            {form.imageUrl && (
              <div className="text-xs text-gray-500 mt-1">Current: <img src={toImageUrl(form.imageUrl)} alt={form.name} className="w-full h-40 object-cover" /></div>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea className="w-full border rounded-lg p-2" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sizes (comma separated)</label>
            <input className="w-full border rounded-lg p-2" value={form.sizes} onChange={e=>setForm({...form,sizes:e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Flavors (comma separated)</label>
            <input className="w-full border rounded-lg p-2" value={form.flavors} onChange={e=>setForm({...form,flavors:e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Size-based Prices</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(form.sizePrices || []).map((p, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    className="flex-1 border rounded-lg p-2"
                    value={p.size}
                    onChange={e=>{
                      const arr = [...form.sizePrices];
                      arr[idx] = { ...arr[idx], size: e.target.value };
                      setForm({ ...form, sizePrices: arr });
                    }}
                    placeholder="Size"
                  />
                  <input
                    type="number"
                    className="w-28 border rounded-lg p-2"
                    value={p.price}
                    onChange={e=>{
                      const arr = [...form.sizePrices];
                      arr[idx] = { ...arr[idx], price: e.target.value };
                      setForm({ ...form, sizePrices: arr });
                    }}
                    placeholder="Price"
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <button type="button" className="px-3 py-1 border rounded-lg" onClick={()=>{
                setForm({...form, sizePrices: [...(form.sizePrices||[]), { size: '', price: '' }]});
              }}>Add Size</button>
              <button type="button" className="px-3 py-1 border rounded-lg" onClick={()=>{
                if ((form.sizePrices||[]).length>0){
                  const arr=[...form.sizePrices]; arr.pop(); setForm({...form, sizePrices: arr});
                }
              }}>Remove Last</button>
            </div>
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button disabled={saving} className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg">
              {saving ? 'Saving...' : (form.id ? 'Update' : 'Create')}
            </button>
            {form.id && (
              <button type="button" className="px-4 py-2 border rounded-lg" onClick={resetForm}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
          cakes.map(c => (
            <div key={c.id} className="bg-white rounded-xl shadow overflow-hidden">
              <img src={toImageUrl(c.imageUrl)} alt={c.name} className="w-full h-40 object-cover" />
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">{c.name}</h4>
                  <span className="font-bold text-pink-600">{Array.isArray(c.sizePrices) && c.sizePrices.length > 0 ? `From K${Math.min(...c.sizePrices.map(sp => sp.price))}` : ''}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">{c.description}</p>
                <div className="flex gap-2">
                  <button className="px-3 py-1 border rounded-lg" onClick={()=>onEdit(c)}>Edit</button>
                  <button className="px-3 py-1 border rounded-lg text-red-600" onClick={()=>onDelete(c.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
