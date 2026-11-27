package pokedex.web;

import pokedex.service.PokedexQueryService;
import pokedex.service.PokedexQueryService.Catalog;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pokedex")
public class PokedexController {
    private final PokedexQueryService service;

    public PokedexController(PokedexQueryService service) {
        this.service = service;
    }

    @GetMapping
    public Catalog catalog() {
        return service.catalog();
    }
}
