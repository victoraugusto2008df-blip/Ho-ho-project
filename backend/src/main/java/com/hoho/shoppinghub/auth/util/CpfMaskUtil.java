package com.hoho.shoppinghub.auth.util;

public final class CpfMaskUtil {

    private CpfMaskUtil() {
    }

    public static String mask(String cpf) {
        return "***." + cpf.substring(3, 6) + "." + cpf.substring(6, 9) + "-**";
    }
}
