using MM.BLL.Context;
using MM.Library.Enums;

namespace MM.BLL
{
    public class GeneralDataBL : BLObject
    {
        public GeneralDataBL(BLContext bLContext) : base(bLContext) { }

        public List<string> GetMoods()
        {
            return Enum.GetNames(typeof(Moods)).ToList();
        }

        public List<string> GetTimesOfDay()
        {
            return Enum.GetNames(typeof(TimesOfDay)).ToList();
        }
    }
}
