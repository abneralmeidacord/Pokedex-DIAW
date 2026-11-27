
package pokedex.model;

import java.util.List;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document("accounts")
public record Account(
        @MongoId String id,
        String name,
        String username,
        String passwordHash,
        int pokemonId,
        List<Integer> favoritePokemonIds
) {}
