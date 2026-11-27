package jp.example.sales.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.example.sales.requests.ClientQueryParameter;
import jp.example.sales.responses.ClientResponse;
import jp.example.sales.services.ClientService;

@RestController
@RequestMapping("/clients")
public class ClientController {

    @Autowired
    private ClientService service;

    /**
     * 取引先情報一覧取得
     * 
     * @param ClientQueryParameter condition 検索条件
     * @return 取引先情報一覧
     */
    @GetMapping("")
    public List<ClientResponse> findAll(ClientQueryParameter condition) {
        List<ClientResponse> clientsList = service.findAll(condition);

        return clientsList;

    }
}
