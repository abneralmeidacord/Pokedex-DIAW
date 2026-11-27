package pokedex.seed;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

final class PokedexSql {
    private static final Pattern ROW = Pattern.compile("^\\((.*)\\),?$");
    private static final Pattern VALUE = Pattern.compile("\\G\\s*(?:'((?:[^']|'')*)'|(-?\\d+))\\s*(,|$)");

    private final String script;

    PokedexSql(String script) {
        this.script = script;
    }

    List<List<String>> rows(String table, int columnCount) {
        var insert = Pattern.compile(
                "INSERT INTO\\s+" + Pattern.quote(table) + "\\s*\\([^)]*\\)\\s*VALUES\\s*([^;]+);"
        ).matcher(script);
        if (!insert.find()) {
            throw new IllegalArgumentException("INSERT ausente no SQL para " + table);
        }
        return insert.group(1).lines()
                .map(String::strip)
                .filter(line -> !line.isEmpty())
                .map(line -> parseRow(table, line, columnCount))
                .toList();
    }

    private List<String> parseRow(String table, String line, int columnCount) {
        var row = ROW.matcher(line);
        if (!row.matches()) {
            throw invalidRow(table, line);
        }
        String fields = row.group(1);
        var values = VALUE.matcher(fields);
        var result = new ArrayList<String>(columnCount);
        while (values.find()) {
            String quoted = values.group(1);
            result.add(quoted == null ? values.group(2) : quoted.replace("''", "'"));
            if (values.group(3).isEmpty() && values.end() == fields.length() && result.size() == columnCount) {
                return result;
            }
        }
        throw invalidRow(table, line);
    }

    private IllegalArgumentException invalidRow(String table, String line) {
        return new IllegalArgumentException("Linha inválida no SQL para " + table + ": " + line);
    }
}
