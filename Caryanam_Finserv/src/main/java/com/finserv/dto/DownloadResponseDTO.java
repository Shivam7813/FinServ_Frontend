package com.finserv.dto;

import lombok.Data;

@Data
public class DownloadResponseDTO {

    private String message;
    private String status;
    private Long totalFiles;
    private String responseTime;


    public void setTotalFiles(int fileCount) {
    }
}
