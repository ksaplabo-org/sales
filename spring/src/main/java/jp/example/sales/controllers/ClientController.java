package jp.example.sales.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.example.sales.requests.ClientRequest;
import jp.example.sales.responses.ClientResponse;
import jp.example.sales.services.ClientService;

@RestController
@RequestMapping("/clients")
public class ClientController {

    @Autowired
    private ClientService Service;

    /**
     * 取引先情報一覧取得
     * 
     * @param clientCode 取引先コード
     * @param clientName 取引先名
     * @param orderKbn 受発注区分
     * @return 取引先情報一覧
     */
    @GetMapping("/")
    public List<ClientResponse> findAll(ClientRequest condition) {
        List<ClientResponse> clientsList;
        clientsList = Service.findAll(condition);

        return clientsList;

    }
}
