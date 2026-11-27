package jp.example.sales.responses;

import java.time.LocalDateTime;

/**
 * レスポンスボディ用のDTOクラス
 */
public class ClientResponse {
    private String clientCode;
    private String clientName;
    private String orderKbn;
    private String postCode;
    private String address1;
    private String address2;
    private String fullAddress;
    private String telNumber;
    private boolean usedFlg;
    private LocalDateTime updatedAt;

    /**
     * レスポンスボディを生成するコンストラクタ
     * 
     * @param clientCode 取引先コード
     * @param clientName 取引先名
     * @param orderKbn 受発注区分
     * @param postCode 郵便番号
     * @param address1 住所1
     * @param address2 住所2
     * @param fullAddress 住所
     * @param telNumber 電話番号
     * @param usedFlg 使用フラグ
     * @param updatedAt 更新日時
     */
    public ClientResponse(
            String clientCode,
            String clientName,
            String orderKbn,
            String postCode,
            String address1,
            String address2,
            String fullAddress,
            String telNumber,
            boolean usedFlg,
            LocalDateTime updatedAt) {
        this.clientCode = clientCode;
        this.clientName = clientName;
        this.orderKbn = orderKbn;
        this.postCode = postCode;
        this.address1 = address1;
        this.address2 = address2;
        this.fullAddress = fullAddress;
        this.telNumber = telNumber;
        this.usedFlg = usedFlg;
        this.updatedAt =updatedAt;
    }

    /**
     * 取引先コードを取得するメソッド
     * 
     * @return
     */
    public String getClientCode() {
        return clientCode;
    }

    /**
     * 取引先名を取得するメソッド
     * 
     * @return 
     */
    public String getClientName() {
        return clientName;
    }

    /**
     * 受発注区分を取得するメソッド
     * 
     * @return 受発注区分
     */
    public String getOrderKbn() {
        return orderKbn;
    }

    /**
     * 郵便番号を取得するメソッド
     * 
     * @return　郵便番号
     */
    public String getPostCode() {
        return postCode;
    }

    /**
     * 住所1を取得するメソッド
     * 
     * @return　住所
     */
    public String getAddress1() {
        return address1;
    }

    /**
     * 住所2を取得するメソッド
     * 
     * @return　住所2
     */
    public String getAddress2() {
        return address2;
    }

    /**
     * 住所を取得するメソッド
     * 
     * @return　住所
     */
    public String getFullAddress() {
        fullAddress = address1 + address2;
        return fullAddress;
    }

    /**
     * 電話番号を取得するメソッド
     * 
     * @return　電話番号
     */
    public String getTelNumber() {
        return telNumber;
    }

    /**
     * 使用フラグを取得するメソッド
     * 
     * @return 使用フラグ（false）
     */
    public boolean getUsedFlg() {
        return usedFlg;
    }
    
    /**
     * 更新日時を取得するメソッド
     * 
     * @return　電話番号
     */
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
