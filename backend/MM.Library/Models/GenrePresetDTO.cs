namespace MM.Library.Models
{
    public class GenrePresetDTO
    {
        public Guid Id { get; set; } = Guid.Empty;

        public string Genre { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public float[] Bands { get; set; } = [];
    }
}