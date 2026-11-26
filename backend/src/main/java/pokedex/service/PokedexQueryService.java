package pokedex.service;

import pokedex.model.Pokemon;
import pokedex.model.PokemonStats;
import pokedex.model.PokemonType;
import pokedex.model.Trainer;
import pokedex.repository.PokemonRepository;
import pokedex.repository.PokemonTypeRepository;
import pokedex.repository.TrainerRepository;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class PokedexQueryService {
    private static final Sort BY_ID = Sort.by("id");

    private final PokemonRepository pokemonRepository;
    private final PokemonTypeRepository typeRepository;
    private final TrainerRepository trainerRepository;

    public PokedexQueryService(
            PokemonRepository pokemonRepository, PokemonTypeRepository typeRepository, TrainerRepository trainerRepository
    ) {
        this.pokemonRepository = pokemonRepository;
        this.typeRepository = typeRepository;
        this.trainerRepository = trainerRepository;
    }

    public Catalog catalog() {
        var types = typeRepository.findAll(BY_ID);
        var typesById = types.stream().collect(Collectors.toMap(PokemonType::id, Function.identity()));
        var pokemon = pokemonRepository.findAll(BY_ID).stream()
                .map(record -> PokemonView.from(record, typesById))
                .toList();
        return new Catalog(types, pokemon, trainerRepository.findAll(BY_ID));
    }

    public record Catalog(List<PokemonType> types, List<PokemonView> pokemon, List<Trainer> trainers) {}

    public record PokemonView(Integer id, String name, PokemonStats stats, List<PokemonType> types, String imageUrl) {
        private static PokemonView from(Pokemon pokemon, Map<Integer, PokemonType> typesById) {
            var types = pokemon.typeIds().stream()
                    .map(typesById::get)
                    .filter(Objects::nonNull)
                    .toList();
            return new PokemonView(pokemon.id(), pokemon.name(), pokemon.stats(), types, pokemon.imageUrl());
        }
    }
}
