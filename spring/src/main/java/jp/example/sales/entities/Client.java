package jp.example.sales.entities;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "clients")
/**
 * 取引先情報を表すクラス
 */
public class Client {
    @Id
    private String clientCode;

    @Column
    private String clientName;

    @Column
    private String orderKbn;

    @Column
    private String postCode;

    @Column
    private String address1;

    @Column
    private String address2;

    @Column
    private String telNumber;

    @Column
    private String createdId;

    @Column
    private Date createdAt;

    @Column
    private String updatedId;

    @Column
    private Date updatedAt;

    /**
     * 取引先コードを取得するメソッド
     * @return　取引先コード
     */
    public String getClientCode() {
        return clientCode;
    }

    /**
     * 取引先コードを設定するメソッド
     * @param clientCode
     */
    public void setClientCode(String clientCode) {
        this.clientCode = clientCode;
    }

    /**
     * 取引先名を取得するメソッド
     * @return　取引先名
     */
    public String getClientName() {
        return clientName;
    }

    /**
     * 取引先名を設定するメソッド
     * @param clientName
     */
    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    /**
     * 受発注区分を取得するメソッド
     * @return　受発注区分
     */
    public String getOrderKbn() {
        return orderKbn;
    }

    /**
     * 受発注区分を設定するメソッド
     * @param orderKbn
     */
    public void setOrderKbn(String orderKbn) {
        this.orderKbn = orderKbn;
    }

    /**
     * 郵便番号を取得するメソッド
     * @return　郵便番号
     */
    public String getPostCode() {
        return postCode;
    }

    /**
     * 郵便番号を設定するメソッド
     * @param postCode
     */
    public void setPostCode(String postCode) {
        this.postCode = postCode;
    }

    /**
     * 住所1を取得するメソッド
     * @return　住所
     */
    public String getAddress1() {
        return address1;
    }

    /**
     * 住所1を設定するメソッド
     * @param address1
     */
    public void setAddress1(String address1) {
        this.address1 = address1;
    }

    /**
     * 住所2を取得するメソッド
     * @return　住所2
     */
    public String getAddress2() {
        return address2;
    }

    /**
     * 住所2を設定するメソッド
     * @param address2
     */
    public void setAddress2(String address2) {
        this.address2 = address2;
    }

    /**
     * 電話番号を取得するメソッド
     * @return　電話番号
     */
    public String getTelNumber() {
        return telNumber;
    }

    /**
     * 電話番号を設定するメソッド
     * @param telNumber
     */
    public void setTelNumber(String telNumber) {
        this.telNumber = telNumber;
    }
}
