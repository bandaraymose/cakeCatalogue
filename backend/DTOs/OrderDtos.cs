using System.Collections.Generic;

namespace CakeCatalogue.Api.DTOs
{
    public class OrderItemDto
    {
        public int CakeId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

    public class CreateOrderDto
    {
        public string CustomerName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public List<OrderItemDto> Items { get; set; } = new();
    }
}
