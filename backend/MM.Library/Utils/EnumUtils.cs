namespace MM.Library.Utils
{
    public static class EnumUtils
    {
        public static bool IsValueInEnumCaseInsensitive<T>(string value) where T : struct, Enum
        {
            if (Enum.TryParse<T>(value, ignoreCase: true, out var val)) 
            {
                return Enum.IsDefined(typeof(T), val);
            }

            return false;
        }
    }
}