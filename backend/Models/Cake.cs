using System.Collections.Generic;

namespace CakeCatalogue.Api.Models
{
    public class Cake
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;

        // Stored as CSV in DB via value converters
        public string SizesCsv { get; set; } = string.Empty;
        public string FlavorsCsv { get; set; } = string.Empty;

        public double Rating { get; set; }
        public int Reviews { get; set; }

        public List<CakePrice> Prices { get; set; } = new();

        // Convenience properties (not mapped directly)
        public List<string> Sizes
        {
            get => string.IsNullOrWhiteSpace(SizesCsv) ? new List<string>() : new List<string>(SizesCsv.Split(','));
            set => SizesCsv = value == null ? string.Empty : string.Join(',', value);
        }
        public List<string> Flavors
        {
            get => string.IsNullOrWhiteSpace(FlavorsCsv) ? new List<string>() : new List<string>(FlavorsCsv.Split(','));
            set => FlavorsCsv = value == null ? string.Empty : string.Join(',', value);
        }
    }
}
