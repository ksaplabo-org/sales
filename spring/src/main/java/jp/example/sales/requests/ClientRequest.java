package jp.example.sales.requests;

/**
 * リクエストボディ用のDTOクラス
 */
public class ClientRequest {
    private String clientCode;
    private String clientName;
    private String orderKbn;

    /**
     * リクエストボディを生成するコンストラクタ
     * 
     * @param clientCode 取引先コード
     * @param clientName 取引先名
     * @param orderKbn 受発注区分
     */
    public ClientRequest(String clientCode, String clientName, String orderKbn) {
        this.clientCode = clientCode;
        this.clientName = clientName;
        this.orderKbn = orderKbn;
    }

    // 引数なしのコンストラクタ
    public ClientRequest() {
    }

    /**
     * 取引先コードを設定するメソッド
     * 
     * @param clientCode
     */
    public void setClientCode(String clientCode) {
        this.clientCode = clientCode;
    }

    /**
     * 取引先コードを取得するメソッド
     * 
     * @return 取引先コード
     */
    public String getClientCode() {
        return clientCode;
    }

    /**
     * 取引先名を設定するメソッド
     * 
     * @param clientName 取引先名
     */
    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    /**
     * 取引先名を取得するメソッド
     * 
     * @return 取引先名
     */
    public String getClientName() {
        return clientName;
    }

    /**
     * 受発注区分を設定するメソッド
     * 
     * @param orderKbn
     */
    public void setOrderKbn(String orderKbn) {
        this.orderKbn = orderKbn;
    }

    /**
     * 受発注区分を取得するメソッド
     * 
     * @return 受発注区分
     */
    public String getOrderKbn() {
        return orderKbn;
    }
}
