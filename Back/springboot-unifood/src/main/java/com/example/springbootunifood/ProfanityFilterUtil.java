package com.example.springbootunifood;

import java.util.List;

public class ProfanityFilterUtil {
    private static final List<String> badWords = List.of(
            "เหี้ย", "สัส", "ควาย", "แม่ง", "ฉิบหาย", "พ่อมึง", "แม่มึง", "ฟาย", "ตอแหล", "อีดอก", "อีเหี้ย",
            "fuck", "shit", "bitch", "asshole", "bastard", "dick", "pussy", "faggot", "slut", "cunt",
            "เฮงซวย", "ห่า", "ไอ้เหี้ย", "มึง", "กู", "หี", "ควย", "เย็ด", "เงี่ยน", "สำส่อน", "หื่น",
            "rape", "suck", "fucker", "cock", "whore", "douche", "retard", "moron", "nigger", "niga", "nigga"
    );

    public static boolean containsProfanity(String text) {
        if (text == null) return false;
        String lower = text.toLowerCase();
        return badWords.stream().anyMatch(lower::contains);
    }
}
