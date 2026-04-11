package com.finserv.emailservice;

public interface EmailService {
    void sendEmail(String to, String subject, String body);
}