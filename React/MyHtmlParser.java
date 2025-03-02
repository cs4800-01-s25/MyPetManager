package com.example.myapp;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

public class MyHtmlParser {
    public static void main(String[] args) throws Exception {
        Document doc = Jsoup.connect("https://example.com").get();
        System.out.println(doc.title());
    }
}