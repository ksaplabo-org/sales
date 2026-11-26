package jp.example.sales.responses;

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
    private String telNumber;

    /**
     * レスポンスボディを生成するコンストラクタ
     * 
     * @param clientCode 取引先コード
     * @param clientName 取引先名
     * @param orderKbn 受発注区分
     * @param postCode 郵便番号
     * @param address1 住所1
     * @param address2 住所2
     * @param telNumber 電話番号
     */
    public ClientResponse(
            String clientCode,
            String clientName,
            String orderKbn,
            String postCode,
            String address1,
            String address2,
            String telNumber) {
        this.clientCode = clientCode;
        this.clientName = clientName;
        this.orderKbn = orderKbn;
        this.postCode = postCode;
        this.address1 = address1;
        this.address2 = address2;
        this.telNumber = telNumber;
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
     * 郵便番号の取得するメソッド
     * 
     * @return　郵便番号
     */
    public String getPostCode() {
        return postCode;
    }

    /**
     * 住所1の取得するメソッド
     * 
     * @return　住所
     */
    public String getAddress1() {
        return address1;
    }

    /**
     * 住所2の取得するメソッド
     * 
     * @return　住所2
     */
    public String getAddress2() {
        return address2;
    }

    /**
     * 電話番号の取得するメソッド
     * 
     * @return　電話番号
     */
    public String getTelNumber() {
        return telNumber;
    }

}
