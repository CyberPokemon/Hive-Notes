# Hive Notes

A simple, secure, and efficient note-taking application built with Spring Boot and PostgreSQL.

## Features

- **Fast and Intuitive**: Create, read, save, and retrieve notes with ease
- **Rich Text Editor**: Support for text formatting including:
  - Bold
  - Italics
  - Underline
  - Bullet points
  - Image insertion
- **Secure Authentication**: User authentication system with strict security protocols
- **Database Persistence**: All notes are securely stored in PostgreSQL

## Tech Stack

- **Backend**: Spring Boot
- **Database**: PostgreSQL
- **Frontend**: HTML, CSS, JavaScript
- **Development Tools**: Maven, VS Code

## Prerequisites

Before running the application, ensure you have the following installed:
- Java Development Kit (JDK)
- Maven
- PostgreSQL Server
- Visual Studio Code with Live Server extension
- Git

## Installation and Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/hive-notes.git
cd hive-notes
```

2. Start PostgreSQL server and create a new database

3. Configure database settings
- Navigate to `src/main/resources/application.properties`
- Update the following properties:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/your_database_name
spring.datasource.username=your_username
spring.datasource.password=your_password
```

4. Build the backend
```bash
mvn clean install
```

5. Run the backend application
- Locate `WebbackendApplication.java`
- Run the file using your IDE or:
```bash
mvn spring-boot:run
```

6. Start the frontend
- Open the frontend directory in VS Code
- Right-click on `index.html`
- Select "Open with Live Server"

## Usage

1. Once the application is running, open your browser and navigate to the URL provided by Live Server

2. Create a new account:
   - Click on "Sign Up"
   - Enter your credentials
   - Submit the form

3. Log in:
   - Enter your credentials
   - Click "Sign In"

4. Start creating notes:
   - Click "New Note"
   - Use the rich text editor to format your content
   - Save your note

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please file an issue in the GitHub repository.
