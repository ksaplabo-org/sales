package jp.example.sales.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import io.micrometer.common.util.StringUtils;
import jp.example.sales.entities.Client;
import jp.example.sales.repositories.ClientRepository;
import jp.example.sales.requests.ClientQueryParameter;
import jp.example.sales.responses.ClientResponse;

@Service
public class ClientService {
    @Autowired
    private ClientRepository repository;

    // 受発注区分の定数
    private String JUCHU_KBN = "1";
    private String HATCHU_KBN = "2";

    /**
     * 取引先情報一覧取得
     * 
     * @param condition 検索条件
     * @return レスポンス情報
     */
    public List<ClientResponse> findAll(ClientQueryParameter condition) {
        // 検索条件の判定
        Specification<Client> spec = Specification.unrestricted();

        // 取引先コードが設定されているかつ空文字列ではない場合
        if (StringUtils.isNotEmpty(condition.getClientCode())) {
            spec = spec
                    .and((root, query, cb) -> cb.like(root.get("clientCode"), "%" + condition.getClientCode() + "%"));
        }

        // 取引先名が設定されているかつ空文字列ではない場合
        if (StringUtils.isNotEmpty(condition.getClientName())) {
            spec = spec
                    .and((root, query, cb) -> cb.like(root.get("clientName"), "%" + condition.getClientName() + "%"));
        }

        // 受発注区分が設定されているかつ検索条件の受発注区分が1または2である場合
        if (StringUtils.isNotEmpty(condition.getOrderKbn())
                && (JUCHU_KBN.equals(condition.getOrderKbn()) || HATCHU_KBN.equals(condition.getOrderKbn()))) {
            spec = spec
                    .and((root, query, cb) -> cb.equal(root.get("orderKbn"), condition.getOrderKbn()));
        }

        List<Client> clients;
        clients = repository.findAll(spec);

        // EntityからResponse DTOへ変換
        List<ClientResponse> response = clients.stream()
                .map(emp -> new ClientResponse(
                        emp.getClientCode(),
                        emp.getClientName(),
                        emp.getOrderKbn(),
                        emp.getPostCode(),
                        emp.getAddress1(),
                        emp.getAddress2(),
                        emp.getAddress1() + emp.getAddress2(),
                        emp.getTelNumber(),
                        false,
                        emp.getUpdatedAt()))
                .toList();

        return response;
    }
}
