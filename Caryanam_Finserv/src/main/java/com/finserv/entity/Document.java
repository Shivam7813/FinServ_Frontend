//package com.finserv.entity;
//
//import com.finserv.enums.DocumentStatus;
//import com.finserv.enums.DocumentType;
//import jakarta.persistence.*;
//import lombok.Data;
//import org.jspecify.annotations.Nullable;
//
//import java.time.LocalDate;
//
//@Data
//@Entity
//public class Document {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    private DocumentType documentType;
//
//    @Column(nullable = false)
//    private String  fileName;
//
//    @Column(nullable = false)
//    private byte [] filePath;
//
//    private Long fileSize;
//
//    @Enumerated(EnumType.STRING)
//    private DocumentStatus status = DocumentStatus.PENDING;
//
//    private LocalDate uploadDate = LocalDate.now();
//    private String ContentType;
//    @ManyToOne
//    @JoinColumn(name = "loan_application_id", nullable = false)
//    private LoanApplication loanApplication;
//
//
//}

package com.finserv.entity;

import com.finserv.enums.DocumentStatus;
import com.finserv.enums.DocumentType;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentType documentType;

    // ✅ FIX: fileName should be String
    @Column(nullable = false)
    private String fileName;

    // Optional (if you want file path also)
    private String filePath;

    private Long fileSize;

    @Enumerated(EnumType.STRING)
    private DocumentStatus status = DocumentStatus.PENDING;

    private LocalDate uploadDate = LocalDate.now();

    // ✅ FIX: correct naming
    private String contentType;

    // ✅ ADD THIS (for byte[] storage)
    @Lob
    private byte[] fileData;

    @ManyToOne
    @JoinColumn(name = "loan_application_id", nullable = false)
    private LoanApplication loanApplication;
}