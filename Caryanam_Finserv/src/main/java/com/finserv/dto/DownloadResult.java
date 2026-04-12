package com.finserv.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DownloadResult {
    private String fileName;
    private byte[] fileBytes;
    private int fileCount;
}