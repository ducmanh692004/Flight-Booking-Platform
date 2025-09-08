import { Container, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const PageNotFound = () => {
    const { t } = useTranslation();
    const handleBackToHome = () => {};

    return (
        <div
            style={{
                minHeight: '100vh', // Take full viewport height
                display: 'flex',
                alignItems: 'center', // Vertically center content
                justifyContent: 'center', // Horizontally center content
                backgroundColor: '#f8f9fa', // Light gray background
                fontFamily: 'Inter, sans-serif', // Use Inter font
                textAlign: 'center', // Center text within the div
                padding: '20px',
            }}
        >
            <Container
                className="p-4 bg-white rounded shadow-sm"
                style={{ maxWidth: '600px' }}
            >
                <h1 className="display-4 fw-bold mb-3 text-primary">
                    404 - Page Not Found
                </h1>
                <p className="lead mb-4" style={{ color: '#6c757d' }}>
                    {t('notFound.sorry')}
                </p>
                <Button
                    onClick={handleBackToHome}
                    variant="primary" // Use Bootstrap's default primary button style (blue)
                    size="lg" // Large button
                    className="mt-3"
                    style={{
                        backgroundColor: '#007bff',
                        borderColor: '#007bff',
                    }} // Custom color if you prefer (e.g., from Traveloka's orange)
                >
                    {t('notFound.backHome')}
                </Button>
            </Container>
        </div>
    );
};

export default PageNotFound;
