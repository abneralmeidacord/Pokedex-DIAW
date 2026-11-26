package pokedex.web;

import pokedex.model.Trainer;
import pokedex.service.PokedexQueryService;
import pokedex.service.PokedexQueryService.TrainerDetail;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/trainers")
public class TrainerController {
    private final PokedexQueryService service;

    public TrainerController(PokedexQueryService service) {
        this.service = service;
    }

    @GetMapping
    public List<Trainer> list() {
        return service.trainers();
    }

    @GetMapping("/{id}")
    public TrainerDetail detail(@PathVariable("id") int id) {
        return service.trainer(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Treinador não encontrado."));
    }
}