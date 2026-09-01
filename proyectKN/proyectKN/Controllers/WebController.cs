using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.IdentityModel.Tokens;
using proyectKN.Filters;
using proyectKN.Models;
using proyectKN.Services;
using System.Net;
using System.Net.Http.Json;

namespace proyectKN.Controllers
{
    public class WebController : Controller
    {
        private readonly IHttpClientFactory _http;
        private readonly IConfiguration _config;
        public WebController(IHttpClientFactory http, IConfiguration config)
        {
            _http = http;
            _config = config;
        }

        [HttpGet]
        public IActionResult Web()
        {
            return View();
        }

        
        [HttpPost]
        public IActionResult AgendarCita(Cita model)
        {
            // VALIDAR HORA
            if (model.HoraCita == TimeSpan.Zero)
            {
                TempData["Error"] = "Debe seleccionar una hora";
                return RedirectToAction("AgendarCita");
            }

            using var client = _http.CreateClient();

            model.Estado = 4;
            model.CreadaPor = 11;

            var url = _config.GetValue<string>("Valores:UrlAPI") + "Cita/RegistroCita";

            var response = client.PostAsJsonAsync(url, model).Result;

            if (response.IsSuccessStatusCode)
            {
                TempData["Success"] = "La cita se solicitó de manera exitosa";
                return RedirectToAction("AgendarCita");
            }

            TempData["Error"] = "Ya tienes una cita registrada en el sistema";
            return RedirectToAction("AgendarCita");
        }
        public IActionResult EstadoVehiculo()
        {
            return View();
        }
        public IActionResult AgendarCita()
        {
            return View();
        }
        [HttpGet]
        public IActionResult ObtenerHorariosDisponibles(string fecha)
        {
            using var client = _http.CreateClient();

            var url = _config.GetValue<string>("Valores:UrlAPI")
                + $"Horario/ConsultarHorarioPorFecha/{fecha}";

            var response = client.GetAsync(url).Result;

            if (!response.IsSuccessStatusCode)
                return Json(new List<HorarioTaller>());

            var data = response.Content
                .ReadFromJsonAsync<List<HorarioTaller>>()
                .Result;

            return Json(data);
        }
        [HttpGet]
        public IActionResult ObtenerHorasOcupadas(string fecha, int? idCita)
        {
            using var client = _http.CreateClient();

            var url = _config.GetValue<string>("Valores:UrlAPI") +
                      $"Cita/ObtenerHorasOcupadas?fecha={fecha}&idCita={idCita}";

            var response = client.GetAsync(url).Result;

            if (!response.IsSuccessStatusCode)
                return Json(new List<string>());

            var horas = response.Content.ReadFromJsonAsync<List<string>>().Result;
            return Json(horas);
        }
    }
}
   