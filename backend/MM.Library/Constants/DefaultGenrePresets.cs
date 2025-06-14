namespace MM.Library.Constants
{
    public static class DefaultGenrePresets
    {
        public static readonly Dictionary<string, float[]> Presets = new Dictionary<string, float[]>
        {
            { "blues",     new float[] { -1,  0,  2,  2,  1,  0, -1,  0,  1,  1 } },
            { "classical", new float[] {  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 } },
            { "country",   new float[] {  0,  1,  1,  2,  1,  0,  0,  0,  0,  0 } },
            { "disco",     new float[] {  2,  3,  2,  1,  0,  0,  1,  2,  3,  2 } },
            { "hiphop",    new float[] {  3,  4,  2,  0, -1, -1,  0,  1,  1,  0 } },
            { "jazz",      new float[] {  0,  1,  1,  2,  2,  1,  0,  0,  1,  0 } },
            { "metal",     new float[] {  2,  3,  0, -3, -4, -3,  0,  3,  3,  2 } },
            { "pop",       new float[] {  0,  1,  2,  2,  1,  0,  1,  1,  2,  2 } },
            { "reggae",    new float[] {  0,  1,  0,  0, -1, -1,  0,  0,  1,  0 } },
            { "rock",      new float[] {  1,  1,  0,  0,  1,  1,  0,  0,  1,  1 } }
        };
    }
}