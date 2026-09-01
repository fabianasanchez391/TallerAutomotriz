using System.ComponentModel.DataAnnotations;

namespace proyectKN_API.Models
{
    public class HorarioResponse
    {
        [Required]
        public int Consecutivo { get; set; }

        [Required]
        public DateTime Fecha { get; set; }

        [Required]
        public TimeSpan HoraInicio { get; set; }

        [Required]
        public TimeSpan HoraFin { get; set; }
        

        [Required]
        public string Estado { get; set; } = string.Empty;
    }
}