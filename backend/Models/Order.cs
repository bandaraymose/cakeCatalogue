using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace CakeCatalogue.Api.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<OrderItem> Items { get; set; } = new();

        [NotMapped]
        public decimal TotalAmount => Items is null ? 0 : decimal.Round(Items.Sum(i => i.UnitPrice * i.Quantity), 2);
    }
}
