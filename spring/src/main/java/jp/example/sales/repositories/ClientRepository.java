package jp.example.sales.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import jp.example.sales.entities.Client;

public interface ClientRepository extends JpaRepository<Client, String>, JpaSpecificationExecutor<Client> {
}
