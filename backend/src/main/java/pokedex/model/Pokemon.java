package pokedex.model;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("pokemons")
public record Pokemon(
        @Id Integer id,
        String name,
        PokemonStats stats,
        List<Integer> typeIds,
        String imageUrl
) {}
