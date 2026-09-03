using System.Collections.Generic;

namespace CakeCatalogue.Api.DTOs
{
    public class CakeCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public List<string> Sizes { get; set; } = new();
        public List<string> Flavors { get; set; } = new();
        public List<SizePriceDto> SizePrices { get; set; } = new();
        public double Rating { get; set; }
        public int Reviews { get; set; }
    }

    public class CakeReadDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public List<string> Sizes { get; set; } = new();
        public List<string> Flavors { get; set; } = new();
        public List<SizePriceDto> SizePrices { get; set; } = new();
        public double Rating { get; set; }
        public int Reviews { get; set; }
    }

    public class SizePriceDto
    {
        public string Size { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
}
