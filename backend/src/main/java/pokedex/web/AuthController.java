package pokedex.web;

import java.security.Principal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import pokedex.service.AccountService;
import pokedex.service.AccountService.Profile;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AccountService accounts;

    public AuthController(AccountService accounts) {
        this.accounts = accounts;
    }

    @GetMapping("/csrf")
    public CsrfToken csrf(CsrfToken token) {
        return token;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@RequestBody Registration registration) {
        accounts.register(registration.name(), registration.username(), registration.password(), registration.pokemonId());
    }

    @GetMapping("/me")
    public Profile profile(Principal principal) {
        return accounts.profile(principal.getName());
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ProblemDetail> validationError(ResponseStatusException error) {
        return ResponseEntity.status(error.getStatusCode()).body(error.getBody());
    }

    public record Registration(String name, String username, String password, Integer pokemonId) {}
}
