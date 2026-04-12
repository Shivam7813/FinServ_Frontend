package com.finserv.dto;

import lombok.Data;

import java.util.List;

@Data
public class PendingDocumentDTO {

    private List<String> pendingDocuments;

    public PendingDocumentDTO(List<String> pendingDocuments) {
        this.pendingDocuments = pendingDocuments;
    }
}
