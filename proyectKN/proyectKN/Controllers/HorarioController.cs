using AspNetCoreGeneratedDocument;
using Microsoft.AspNetCore.Mvc;
using proyectKN.Filters;
using proyectKN.Models;
using System.Net;

namespace proyectKN.Controllers
{
    [SesionActiva]
    public class HorarioController : Controller
    {
        private readonly IHttpClientFactory _http;
        private readonly IConfiguration _config;
        public HorarioController(IHttpClientFactory http, IConfiguration config)
        {
            _http = http;
            _config = config;
        }
        [HttpGet]
        public IActionResult GestionHorario()
        {
            using var client = _http.CreateClient();

            var urlEstado = _config.GetValue<string>("Valores:UrlAPI") + "Estado/ObtenerEstado/5";
            var urlHorario = _config.GetValue<string>("Valores:UrlAPI") + "Horario/ConsultarHorario";


            ViewBag.EstadoHorario = new List<EstadoM>();

            var responseEstado = client.GetAsync(urlEstado).Result;

            if (responseEstado.IsSuccessStatusCode)
            {
                var listaEstados = responseEstado.Content
                    .ReadFromJsonAsync<List<EstadoM>>()
                    .Result;

                ViewBag.EstadoHorario = listaEstados
                    .Where(e =>
                        e.Estado == "Abierto" ||
                        e.Estado == "Cerrado" ||
                        e.Estado == "Vacaciones")
                    .ToList();
            }


            ViewBag.Horarios = new List<HorarioTaller>();

            var responseHorario = client.GetAsync(urlHorario).Result;

            if (responseHorario.IsSuccessStatusCode)
            {
                var listaHorario = responseHorario.Content
                    .ReadFromJsonAsync<List<HorarioTaller>>()
                    .Result;

                ViewBag.Horarios = listaHorario
                    .Where(c => c.Estado != "Cancelada")
                    .ToList();
            }

            return View();
        }

        [HttpPost]
        public IActionResult GestionHorario(HorarioRequest model)
        {
         
            if (model.FechaFin < model.FechaInicio)
            {
                TempData["Error"] = "La fecha final no puede ser anterior a la fecha inicial.";
                return RedirectToAction("GestionHorario");
            }

            using var client = _http.CreateClient();

            var url = _config.GetValue<string>("Valores:UrlAPI") + "Horario/GuardarHorario";

            var result = client.PostAsJsonAsync(url, model).Result;

            if (result.IsSuccessStatusCode)
            {
                TempData["Success"] = "Horario guardado correctamente";
            }
            else
            {
                var error = result.Content.ReadAsStringAsync().Result;
                TempData["Error"] = error;
            }

            return RedirectToAction("GestionHorario"); 
        }
        [HttpGet]
        public IActionResult ConsultarHorarioPorFecha(string fecha)
        {
            using var client = _http.CreateClient();

            var url = _config.GetValue<string>("Valores:UrlAPI") +
                      $"Horario/ConsultarHorarioPorFecha/{fecha}";

            var response = client.GetAsync(url).Result;

            if (!response.IsSuccessStatusCode)
                return Json(new List<HorarioTaller>());

            var data = response.Content
                .ReadFromJsonAsync<List<HorarioTaller>>()
                .Result;

            return Json(data);
        }
    }
}