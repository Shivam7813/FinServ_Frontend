package com.finserv.repository;

import com.finserv.entity.Document;
import com.finserv.enums.DocumentStatus;
import com.finserv.enums.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByLoanApplicationId(Long loanId);

    long countByLoanApplicationId(Long loanId);

    Optional<Document> findByLoanApplicationIdAndDocumentType(Long loanId, DocumentType docType);

    Long countByStatus(DocumentStatus status);
}