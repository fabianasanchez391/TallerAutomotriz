using System.ComponentModel.DataAnnotations;

namespace proyectKN_API.Models
{
    public class HorarioRequest
    {
        [Required]
        public DateTime FechaInicio { get; set; }

        [Required]
        public DateTime FechaFin { get; set; }

        [Required]
        public List<string> HorasSeleccionadas { get; set; } = new();
        [Required]
        public int Estado { get; set; }
    }
}
