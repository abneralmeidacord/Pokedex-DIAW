package pokedex.seed;

import pokedex.model.Pokemon;
import pokedex.model.PokemonStats;
import pokedex.model.PokemonType;
import pokedex.model.Trainer;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.model.BulkWriteOptions;
import com.mongodb.client.model.UpdateOneModel;
import com.mongodb.client.model.UpdateOptions;
import com.mongodb.client.model.WriteModel;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Component
@Profile("seed")
public class PokedexSeed implements CommandLineRunner {
    private static final Logger LOGGER = LoggerFactory.getLogger(PokedexSeed.class);
    private static final String ARTWORK_URL =
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";

    private final MongoTemplate mongo;
    private final ObjectMapper json;

    public PokedexSeed(MongoTemplate mongo, ObjectMapper json) {
        this.mongo = mongo;
        this.json = json;
    }

    @Override
    public void run(String... args) throws IOException {
        var sql = new PokedexSql(new ClassPathResource("Script_Pokedex.sql").getContentAsString(StandardCharsets.UTF_8));

        var types = new ArrayList<>(sql.rows("Types", 2).stream()
                .map(row -> new PokemonType(number(row, 0), row.get(1)))
                .toList());
        types.add(new PokemonType(18, "Fairy"));
        var typesByName = types.stream().collect(Collectors.toMap(PokemonType::name, PokemonType::id));

        var pokemonTypes = relations(sql, "Rel_Pokemon_Type");
        var pokemon = new ArrayList<>(sql.rows("Pokemon", 8).stream()
                .map(row -> {
                    int id = number(row, 0);
                    var stats = new PokemonStats(number(row, 2), number(row, 3), number(row, 4),
                            number(row, 5), number(row, 6), number(row, 7));
                    return pokemon(id, row.get(1), stats, pokemonTypes.getOrDefault(id, List.of()));
                })
                .toList());
        validateRelations(pokemonTypes, ids(pokemon, Pokemon::id), ids(types, PokemonType::id), "Rel_Pokemon_Type");
        pokemon.addAll(readKalos(typesByName));

        var trainerTeams = relations(sql, "Rel_Trainer_Pokemon");
        var trainers = sql.rows("Trainers", 3).stream()
                .map(row -> {
                    int id = number(row, 0);
                    return new Trainer(id, row.get(1), number(row, 2), List.copyOf(trainerTeams.getOrDefault(id, List.of())));
                })
                .toList();
        validateRelations(trainerTeams, ids(trainers, Trainer::id), ids(pokemon, Pokemon::id), "Rel_Trainer_Pokemon");

        insertMissing(PokemonType.class, types);
        insertMissing(Pokemon.class, pokemon);
        insertMissing(Trainer.class, trainers);
    }

    private List<Pokemon> readKalos(Map<String, Integer> typesByName) throws IOException {
        try (var stream = new ClassPathResource("kalos-pokemon.json").getInputStream()) {
            List<KalosPokemon> records = json.readValue(stream, new TypeReference<>() {});
            return records.stream()
                    .map(record -> {
                        var typeIds = record.types().stream().map(name -> {
                            Integer id = typesByName.get(name);
                            if (id == null) {
                                throw new IllegalArgumentException("Tipo desconhecido em Kalos: " + name);
                            }
                            return id;
                        }).toList();
                        return pokemon(record.id(), record.name(), record.stats(), typeIds);
                    })
                    .toList();
        }
    }

    private Pokemon pokemon(int id, String name, PokemonStats stats, List<Integer> typeIds) {
        return new Pokemon(id, name, stats, List.copyOf(typeIds), ARTWORK_URL + id + ".png");
    }

    private Map<Integer, List<Integer>> relations(PokedexSql sql, String table) {
        var relations = new HashMap<Integer, List<Integer>>();
        for (var row : sql.rows(table, 2)) {
            relations.computeIfAbsent(number(row, 0), id -> new ArrayList<>()).add(number(row, 1));
        }
        return relations;
    }

    private void validateRelations(
            Map<Integer, List<Integer>> relations, Set<Integer> from, Set<Integer> to, String table
    ) {
        if (!from.containsAll(relations.keySet()) || relations.values().stream().anyMatch(ids -> !to.containsAll(ids))) {
            throw new IllegalArgumentException("Referência inválida no SQL para " + table);
        }
    }

    private <T> Set<Integer> ids(List<T> records, Function<T, Integer> getId) {
        return records.stream().collect(Collectors.toUnmodifiableMap(getId, Function.identity())).keySet();
    }

    private int number(List<String> row, int column) {
        return Integer.parseInt(row.get(column));
    }

    private <T> void insertMissing(Class<T> model, List<T> records) {
        List<WriteModel<Document>> updates = new ArrayList<>(records.size());
        for (T record : records) {
            var document = new Document();
            mongo.getConverter().write(record, document);
            var filter = new Document("_id", document.remove("_id"));
            updates.add(new UpdateOneModel<>(filter, new Document("$setOnInsert", document), new UpdateOptions().upsert(true)));
        }

        String collection = mongo.getCollectionName(model);
        int inserted = mongo.getCollection(collection).bulkWrite(updates, new BulkWriteOptions().ordered(false))
                .getUpserts().size();
        LOGGER.info("{}: {} novos, {} já existentes", collection, inserted, records.size() - inserted);
    }

    private record KalosPokemon(int id, String name, PokemonStats stats, List<String> types) {}
}
