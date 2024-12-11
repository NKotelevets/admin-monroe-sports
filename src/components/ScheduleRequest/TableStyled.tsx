import styled from '@emotion/styled'
import { Table } from 'antd'

import { IScheduleEntry } from '@/common/interfaces'

export const TableStyled = styled(Table<IScheduleEntry>)`
    table-layout: fixed;
    & colgroup col:first-of-type {
        display: table-column; /* Hides the colgroup */
        
        max-width: 45px !important;
        min-width: 45px !important;
    }
    & .ant-table-thead > tr > th {
        height: 48px; /* Set your desired height */
        border-bottom: 1px solid #BDBCC2;
    }
    & .ant-table-thead th.ant-table-cell {
        padding: 0 !important;
    }
    & .date-column {
        background-color: #F1F0FF;
        border-bottom: 1px solid #CBC7FF !important;
        color: #1A1657D9;
        padding-left: 12px !important;
        width: 172px;
    }
    & .ant-table-row:hover .date-column {
        background-color: #ece9ff; /* Same as base to prevent override */
    }
`
