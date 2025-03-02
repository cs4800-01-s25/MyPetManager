package com.example.mypetmanager.controller;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Controller
public class WebController {

    @GetMapping("/scrape-links")
    public String scrapeLinks(@RequestParam String url, Model model) {
        List<String> links = new ArrayList<>();

        try {
            Document doc = Jsoup.connect(url).get();
            Elements anchorTags = doc.select("a[href]");
            for (Element link : anchorTags) {
                links.add(link.attr("abs:href"));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        model.addAttribute("links", links);
        return "scraped-links"; 
    }
}
