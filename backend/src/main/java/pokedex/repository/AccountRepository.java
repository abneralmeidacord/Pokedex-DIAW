package pokedex.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import pokedex.model.Account;

public interface AccountRepository extends MongoRepository<Account, String> {}
