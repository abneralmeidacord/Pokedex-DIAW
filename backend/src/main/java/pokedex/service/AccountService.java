package pokedex.service;

import java.util.Locale;
import java.util.regex.Pattern;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pokedex.model.Account;
import pokedex.repository.AccountRepository;
import pokedex.repository.PokemonRepository;

@Service
public class AccountService implements UserDetailsService {
    private static final Pattern USERNAME = Pattern.compile("[a-zA-Z0-9_]{3,24}");

    private final AccountRepository accounts;
    private final PokemonRepository pokemon;
    private final PasswordEncoder passwords;

    public AccountService(AccountRepository accounts, PokemonRepository pokemon, PasswordEncoder passwords) {
        this.accounts = accounts;
        this.pokemon = pokemon;
        this.passwords = passwords;
    }

    public void register(String name, String username, String password, Integer pokemonId) {
        name = name == null ? "" : name.strip();
        username = username == null ? "" : username.strip();
        if (name.length() < 2 || name.length() > 60) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe um nome de 2 a 60 caracteres.");
        }
        if (!USERNAME.matcher(username).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Use de 3 a 24 letras, números ou sublinhados no usuário.");
        }
        if (password == null || password.isBlank() || password.length() < 8 || password.length() > 128) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe uma senha de 8 a 128 caracteres.");
        }
        if (pokemonId == null || pokemonId <= 0 || !pokemon.existsById(pokemonId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Escolha um Pokémon do catálogo para o perfil.");
        }
        var account = new Account(accountId(username), name, username, passwords.encode(password), pokemonId);
        try {
            accounts.insert(account);
        } catch (DuplicateKeyException exception) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe uma conta com esse nome de usuário.");
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        var account = accounts.findById(accountId(username))
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado."));
        return User.withUsername(account.id()).password(account.passwordHash()).roles("USER").build();
    }

    public Profile profile(String id) {
        return accounts.findById(id)
                .map(account -> new Profile(account.username(), account.pokemonId()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }

    private String accountId(String username) {
        return username.strip().toLowerCase(Locale.ROOT);
    }

    public record Profile(String username, int pokemonId) {}
}
