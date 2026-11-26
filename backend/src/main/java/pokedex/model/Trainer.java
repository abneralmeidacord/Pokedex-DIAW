package pokedex.model;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("trainers")
public record Trainer(@Id Integer id, String name, int badges, List<Integer> pokemonIds) {}
