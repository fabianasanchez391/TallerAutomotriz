namespace proyectKN.Models
{
    public class HorarioRequest
    {
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }

        public DateTime HoraInicio { get; set; }
        public DateTime HoraFin { get; set; }
        public List<string> HorasSeleccionadas { get; set; } = new();
        public int Estado { get; set; }
    }
}