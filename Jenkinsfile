pipeline {
    agent any

    environment {
        EXPRESS_PORT = '5000'
    }

    stages {
        stage('Clone Repo') {
            steps {
                script {
                    sh '''
                    git clone git@github.com:RihemTaieb/OMHY-Entertainment-back.git backend
                    '''
                }
            }
        }

        stage('Build and Deploy Express') {
            steps {
                script {
                    sh '''
                    cd backend
                    docker build -t express-app .
                    docker stop express-app || true
                    docker rm express-app || true
                    docker run -d -p 5000:5000 --name express-app express-app
                    '''
                }
            }
        }

        stage('Cleanup') {
            steps {
                script {
                    sh "rm -rf backend"
                }
            }
        }
    }

    post {
        success {
            echo "Express backend deployment successful!"
        }
        failure {
            echo "Express backend deployment failed!"
        }
    }
}
