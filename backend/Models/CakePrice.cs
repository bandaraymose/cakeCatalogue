namespace CakeCatalogue.Api.Models
{
    public class CakePrice
    {
        public int Id { get; set; }
        public int CakeId { get; set; }
        public Cake? Cake { get; set; }
        public string Size { get; set; } = string.Empty; // Small, Medium, Large
        public decimal Price { get; set; }
    }
}
