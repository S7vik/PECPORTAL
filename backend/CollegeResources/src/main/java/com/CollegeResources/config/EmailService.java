package com.CollegeResources.config;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service

public class EmailService {

    private JavaMailSender javaMailSender;

    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    // Send OTP email
    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("your-email@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Your OTP for Email Verification");
        message.setText("Your OTP is: " + otp);

        javaMailSender.send(message);
        System.out.println("OTP sent to " + toEmail);
    }
}