# GPS & Wyscout Sports Analytics Data Warehouse

## Project Overview
This hackathon project focuses on organizing and structuring raw sports performance data from GPS tracking and Wyscout match analytics into a proper **Data Warehouse**.  

The raw data provided was already processed by an ETL process, but it remained **messy and unstructured**, with hundreds of columns in CSV and SQL formats. To make it suitable for analysis and modeling (e.g., predicting player fatigue), we designed a **star-schema data warehouse** with **dimension** and **fact tables**.

## Platform & Tools
- **Azure SQL Database**: All staging, dimension, and fact tables were created and hosted on Azure SQL Database (student subscription).  
- **Azure Data Studio**: Used to connect to the Azure SQL server, create tables, and execute SQL scripts.  
- **SQL Scripts**: Separate scripts for staging, dimension, and fact tables allow organized creation and loading of data.  

## Data Organization
Due to the large number of columns in the raw data, we extracted only the relevant attributes into **staging tables** for each source:  

- `staging_matchs_gps.sql`  
- `staging_training_gps.sql`  
- `staging_wyscout_matchs.sql`  
- `staging_wyscout_players_goalkeeper.sql`  
- `staging_wyscout_players_outfield.sql`  

From these staging tables, we populated the **dimension** and **fact tables**:

### Dimension Tables
- `dim_date` — calendar and date attributes  
- `dim_player` — player information and identifiers  
- `dim_team` — team information and identifiers  
- `dim_competition` — competition metadata  
- `dim_match` — match metadata and relationships  

### Fact Tables
- `fact_player_gps` — player GPS workload during matches and training  
- `fact_player_wyscout` — player performance metrics from Wyscout  
- `fact_wyscout_match` — team-level Wyscout match statistics  

These tables are designed to support analytics queries efficiently and provide a clean, unified view of player and match performance data.

### ETL Clarification

The provided datasets had already undergone an ETL process, but were still unstructured and difficult to analyze.

In this project:

We did not perform the full ETL from raw sources.

We loaded the data from the provided CSVs into staging tables, selected relevant columns, and transformed/loaded them into the fact and dimension tables in our data warehouse.

This workflow corresponds to the Transform and Load phases of ETL.


## Notes
- Only a subset of columns from the raw data were selected to populate the staging tables and downstream dimensions/facts.  
- Azure SQL Database was used to centralize all data for easier querying and analysis.  
- The ERD diagram illustrates the relationships between dimensions and facts, following a star schema design.  
- The warehouse is ready for analytics queries and predictive modeling, such as **player fatigue prediction**.

---

