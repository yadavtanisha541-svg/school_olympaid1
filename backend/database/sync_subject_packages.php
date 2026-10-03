<?php
require_once __DIR__ . '/../config/database.php';
use App\Config\Database;

$pdo = Database::getConnection();

$packages = [
    [
        'id' => 'oc_pkg_reasoning_6',
        'title' => 'Reasoning Recorded Concept Classes - Class 6',
        'class_name' => 'Class 6',
        'subject' => 'Reasoning (ISSO)',
        'subject_code' => 'ISSO',
        'package_type' => 'subject_concept',
        'price' => 1999.00,
        'original_price' => 2500.00,
        'badge_text' => 'Special Offer',
        'special_offer_text' => 'Special Offer: 2500.00 — 1999.00',
        'header_color' => '#d49b28',
        'status' => 'active',
        'features' => [
            'Recorded classes covering the entire syllabus (chapter-wise)',
            'Previous Year Papers\' Questions discussion and Doubt Solving',
            'Total 20 recorded classes (full sessions) available for revision',
            'Reasoning Skill Development Package for mastering Logical Reasoning',
            'Intelligent Olympiad Test Generator with smart question selection'
        ],
        'sections' => [
            [
                'title' => 'Recorded Classes',
                'color' => 'blue',
                'items' => [
                    'Recorded classes covering the entire syllabus (chapter-wise)',
                    'Previous Year Papers\' Questions discussion and Doubt Solving',
                    'Total 20 recorded classes (full sessions) available for revision'
                ]
            ],
            [
                'title' => 'Practice & Tests',
                'color' => 'purple',
                'items' => [
                    'Chapter-wise Presentation Videos for practice and reinforcement',
                    'Chapter-wise Assignments given as homework for additional practice',
                    'Chapter-wise Quizzes for quick revision',
                    'Reasoning Skill Development Package for mastering Logical Reasoning'
                ]
            ],
            [
                'title' => 'Intelligent Olympiad Test Generator',
                'color' => 'green',
                'items' => [
                    'A bigger, "Intelligent" question bank',
                    'Smart Question Selection',
                    'Generate upto 10 personalised tests'
                ]
            ]
        ]
    ],
    [
        'id' => 'oc_pkg_imo_6',
        'title' => 'IMO Self-Paced Recorded Concept Classes - Class 6',
        'class_name' => 'Class 6',
        'subject' => 'Mathematics (IMO)',
        'subject_code' => 'IMO',
        'package_type' => 'subject_concept',
        'price' => 2999.00,
        'original_price' => 3500.00,
        'badge_text' => 'Special Offer',
        'special_offer_text' => 'Special Offer: 3500.00 — 2999.00',
        'header_color' => '#d49b28',
        'status' => 'active',
        'features' => [
            'Chapter wise Recorded classes covering the entire syllabus',
            'Level-1 Previous Year Papers 2024 & 2025 discussion and Doubt Solving',
            'Chapter-wise Quizzes for quick revision',
            'Chapter-wise Presentation Videos for practice and reinforcement',
            'Chapter-wise Assignments given for additional practice',
            'Level-1 Previous Year Papers 2024 & 2025',
            'Intelligent Olympiad Test Generator with smart question selection'
        ],
        'sections' => [
            [
                'title' => 'Recorded Classes',
                'color' => 'blue',
                'items' => [
                    'Chapter wise Recorded classes covering the entire syllabus',
                    'Level-1 Previous Year Papers 2024 & 2025 discussion and Doubt Solving'
                ]
            ],
            [
                'title' => 'Practice & Tests',
                'color' => 'purple',
                'items' => [
                    'Chapter-wise Quizzes for quick revision',
                    'Chapter-wise Presentation Videos for practice and reinforcement',
                    'Chapter-wise Assignments given for additional practice',
                    'Level-1 Previous Year Papers 2024 & 2025'
                ]
            ],
            [
                'title' => 'Intelligent Olympiad Test Generator',
                'color' => 'green',
                'items' => [
                    'A bigger, "Intelligent" question bank',
                    'Smart Question Selection',
                    'Generate upto 10 personalised tests'
                ]
            ]
        ]
    ],
    [
        'id' => 'oc_pkg_ieo_6',
        'title' => 'IEO Recorded Concept Classes - Class 6',
        'class_name' => 'Class 6',
        'subject' => 'English (IEO)',
        'subject_code' => 'IEO',
        'package_type' => 'subject_concept',
        'price' => 2499.00,
        'original_price' => 3000.00,
        'badge_text' => 'Special Offer',
        'special_offer_text' => 'Special Offer: 3000.00 — 2499.00',
        'header_color' => '#80497D',
        'status' => 'active',
        'features' => [
            'Total 25 Recorded Classes covering the entire syllabus - Chapter-wise',
            '2 Previous Year Papers (2024 & 2025)',
            'Chapter-wise Presentation Videos & Assignments',
            'Intelligent Olympiad Test Generator with smart question selection'
        ],
        'sections' => [
            [
                'title' => 'Recorded Classes',
                'color' => 'blue',
                'items' => [
                    'Total 25 Recorded Classes – Learn, Revisit & Revise Anytime',
                    'Recorded classes covering the entire syllabus - Chapter-wise',
                    '2 Previous Year Papers (2024 & 2025)'
                ]
            ],
            [
                'title' => 'Practice & Tests',
                'color' => 'purple',
                'items' => [
                    'Chapter-wise Presentation Videos for practice and reinforcement',
                    'Chapter-wise Assignments for additional practice',
                    'Chapter-wise Quizzes for quick revision',
                    '2 Level-1 Previous Year Papers (2024 & 2025)'
                ]
            ],
            [
                'title' => 'Intelligent Olympiad Test Generator',
                'color' => 'green',
                'items' => [
                    'A bigger, "Intelligent" question bank',
                    'Smart Question Selection',
                    'Generate upto 10 personalised tests'
                ]
            ]
        ]
    ],
    [
        'id' => 'oc_pkg_iso_6',
        'title' => 'ISO (NSO) Recorded Concept Classes - Class 6',
        'class_name' => 'Class 6',
        'subject' => 'Science (ISO/NSO)',
        'subject_code' => 'ISO',
        'package_type' => 'subject_concept',
        'price' => 2999.00,
        'original_price' => 3500.00,
        'badge_text' => 'Special Offer',
        'special_offer_text' => 'Special Offer: 3500.00 — 2999.00',
        'header_color' => '#059669',
        'status' => 'active',
        'features' => [
            'Total 27 Recorded Classes covering the entire syllabus - Chapter-wise',
            '2 Previous Year Papers (2024 & 2025)',
            'Chapter-wise Presentation Videos & Assignments',
            'Intelligent Olympiad Test Generator with smart question selection'
        ],
        'sections' => [
            [
                'title' => 'Recorded Classes',
                'color' => 'blue',
                'items' => [
                    'Total 27 Recorded Classes – Learn, Revisit & Revise Anytime',
                    'Recorded classes covering the entire syllabus - Chapter-wise',
                    '2 Previous Year Papers (2024 & 2025)'
                ]
            ],
            [
                'title' => 'Practice & Tests',
                'color' => 'purple',
                'items' => [
                    'Chapter-wise Presentation Videos for practice and reinforcement',
                    'Chapter-wise Assignments for additional practice',
                    'Chapter-wise Quizzes for quick revision',
                    '2 Level-1 Previous Year Papers (2024 & 2025)'
                ]
            ],
            [
                'title' => 'Intelligent Olympiad Test Generator',
                'color' => 'green',
                'items' => [
                    'A bigger, "Intelligent" question bank',
                    'Smart Question Selection',
                    'Generate upto 10 personalised tests'
                ]
            ]
        ]
    ]
];

$stmt = $pdo->prepare("
    REPLACE INTO online_class_packages 
    (id, title, class_name, subject, subject_code, package_type, price, original_price, badge_text, special_offer_text, header_color, status, features, sections)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

foreach ($packages as $pkg) {
    $stmt->execute([
        $pkg['id'],
        $pkg['title'],
        $pkg['class_name'],
        $pkg['subject'],
        $pkg['subject_code'],
        $pkg['package_type'],
        $pkg['price'],
        $pkg['original_price'],
        $pkg['badge_text'],
        $pkg['special_offer_text'],
        $pkg['header_color'],
        $pkg['status'],
        json_encode($pkg['features'], JSON_UNESCAPED_UNICODE),
        json_encode($pkg['sections'], JSON_UNESCAPED_UNICODE)
    ]);
    echo "Upserted in MySQL: {$pkg['title']} (₹{$pkg['price']})\n";
}

echo "\nAll packages synced successfully in MySQL database.\n";
