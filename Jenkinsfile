pipeline {
    agent any

    parameters {
        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit'],
            description: 'Select the browser to run Playwright tests on'
        )
        choice(
            name: 'TEST_SUITE',
            choices: ['all', 'tests/pim.spec.ts', 'tests/employeeList.spec.ts'],
            description: 'Select which test suite or spec file to execute'
        )
		choice(
        name: 'TEST_TAG',
        choices: ['all', '@smoke', '@regression'],
        description: 'Filter tests by tag (or select all)'
		)
        string(
            name: 'WORKERS',
            defaultValue: '2',
            description: 'Number of parallel workers'
        )
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Clean Previous Artifacts') {
            steps {
                bat 'if exist allure-results rmdir /s /q allure-results'
                bat 'if exist .auth rmdir /s /q .auth'
            }
        }

        stage('Install Dependencies & Browsers') {
            steps {
                bat 'npm ci'
                bat "npx playwright install ${params.BROWSER}"
            }
        }

        stage('Run Playwright Tests') {
            steps {
                script {
                    def suiteTarget = (params.TEST_SUITE == 'all') ? '' : params.TEST_SUITE
					def tagFilter   = (params.TEST_TAG == 'all')   ? '' : "--grep \"${params.TEST_TAG}\""
					
                    bat "npx playwright test ${suiteTarget} ${tagFilter} --project=${params.BROWSER} --workers=${params.WORKERS}"
                }
            }
        }
    }

    post {
        always {
            // Publishes allure-results directly into Jenkins build sidebar (requires Jenkins Allure Plugin)
            allure([
                includeProperties: false,
                jdk: '',
                properties: [],
                reportBuildPolicy: 'ALWAYS',
                results: [[path: 'allure-results']]
            ])
        }
    }
}