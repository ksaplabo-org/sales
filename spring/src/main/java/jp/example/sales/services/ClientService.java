package jp.example.sales.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jp.example.sales.entities.Client;
import jp.example.sales.repositories.ClientRepository;
import jp.example.sales.requests.ClientRequest;
import jp.example.sales.responses.ClientResponse;

@Service
public class ClientService {
    @Autowired
    private ClientRepository Repository;

    /**
     * 取引先情報一覧取得
     * 
     * @param condition 検索条件
     * @return レスポンス情報
     */
    public List<ClientResponse> findAll(ClientRequest condition) {
        // 検索条件の判定
        Specification<Client> spec = null;

        // 取引先コードが設定されているかつ空文字列ではない場合
        if (condition.getClientCode() != null
                && !condition.getClientCode().isEmpty()) {

            Specification<Client> codeSpec = (root, query, cb) -> cb.like(root.get("clientCode"),
                    "%" + condition.getClientCode() + "%");

            spec = (spec == null) ? codeSpec : spec.and(codeSpec);
        }

        // 取引先名が設定されているかつ空文字列ではない場合
        if (condition.getClientName() != null
                && !condition.getClientName().isEmpty()) {

            Specification<Client> nameSpec = (root, query, cb) -> cb.like(root.get("clientName"),
                    "%" + condition.getClientName() + "%");

            spec = (spec == null) ? nameSpec : spec.and(nameSpec);
        }

        // 受発注区分が設定されているかつ検索条件の受発注区分が1または2である場合
        if (condition.getOrderKbn() != null
                && ("1".equals(condition.getOrderKbn())
                        || "2".equals(condition.getOrderKbn()))) {

            Specification<Client> orderSpec = (root, query, cb) -> cb.equal(root.get("orderKbn"),
                    condition.getOrderKbn());

            spec = (spec == null) ? orderSpec : spec.and(orderSpec);
        }

        List<Client> clients;

        if (spec == null) {
            // 検索条件がない場合
            clients = Repository.findAll();
        } else {
            // 検索条件がある場合
            clients = Repository.findAll(spec);
        }

        // EntityからResponse DTOへ変換
        List<ClientResponse> response = new ArrayList<>();
        for (Client emp : clients) {
            ClientResponse clientResponse = new ClientResponse(
                    emp.getClientCode(),
                    emp.getClientName(),
                    emp.getOrderKbn(),
                    emp.getPostCode(),
                    emp.getAddress1(),
                    emp.getAddress2(),
                    emp.getTelNumber());

            response.add(clientResponse);
        }

        return response;
    }
}
