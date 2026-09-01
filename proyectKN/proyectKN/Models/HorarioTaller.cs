
namespace proyectKN.Models
{
    public class HorarioTaller
    {
        public int Consecutivo { get; set; }

        public DateTime Fecha { get; set; }

        public TimeSpan HoraInicio { get; set; }

        public TimeSpan HoraFin { get; set; }

        public string Estado { get; set; } = string.Empty;
    }
}