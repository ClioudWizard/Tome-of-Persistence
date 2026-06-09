from dataclasses import dataclass, field
from typing import List, Dict, Any

@dataclass
class MockDOMNode:
    tag: str
    id: str = ''
    classes: List[str] = field(default_factory=list)
    children: List['MockDOMNode'] = field(default_factory=list)
    shadow: List['MockDOMNode'] = field(default_factory=list)

    def find(self, selector: str) -> List['MockDOMNode']:
        selector = selector.strip()
        found = []
        if selector == self.tag or selector == f'#{self.id}' or selector in self.classes:
            found.append(self)
        for child in self.children:
            found.extend(child.find(selector))
        for s in self.shadow:
            found.extend(s.find(selector))
        return found


class DevEngineScriptLibrary:
    def __init__(self):
        self.storage = []

    def serialize(self, payload: Any):
        self.storage.append(payload)


class OmnIHook:
    def __init__(self):
        self.fetch_calls = 0
        self.event_calls = 0

    def fetch(self, url: str, **kwargs):
        self.fetch_calls += 1
        return {'url': url, 'status': 200, 'body': 'mocked'}

    def add_event_listener(self, event: str, callback: Any):
        self.event_calls += 1
        return {'event': event, 'callback': callback}


def findDeep(root: MockDOMNode, selector: str, max_depth: int = 20, depth: int = 0) -> List[MockDOMNode]:
    if depth > max_depth:
        raise RecursionError('findDeep exceeded max recursion depth')
    nodes = root.find(selector)
    return nodes


def auditCollision(nodes: List[MockDOMNode]) -> Dict[str, Any]:
    return {
        'count': len(nodes),
        'issues': [n.tag for n in nodes if 'collision' in n.classes]
    }


def traceLineage(node: MockDOMNode, depth: int = 0, max_depth: int = 20) -> List[str]:
    if depth > max_depth:
        return ['max depth reached']
    lineage = [node.tag]
    for child in node.children:
        lineage.extend(traceLineage(child, depth + 1, max_depth))
    return lineage


class MockDevEngine:
    def __init__(self):
        self.omni = OmnIHook()
        self.library = DevEngineScriptLibrary()
        self.dom_root = MockDOMNode(
            tag='body',
            children=[
                MockDOMNode(tag='div', id='main', classes=['container'], children=[
                    MockDOMNode(tag='span', classes=['line-content', 'status'], children=[]),
                    MockDOMNode(tag='section', classes=['shadow-host'], shadow=[
                        MockDOMNode(tag='div', classes=['shadow-item', 'collision'])
                    ])
                ])
            ]
        )
        self.logs = [
            '2026-06-09 21:00 [info] startup complete',
            '2026-06-09 21:01 [warn] possible shadow DOM mismatch',
            '2026-06-09 21:02 [error] event listener overflow',
            '<div class="line-content">line A</div>'
        ]

    def listComponents(self) -> List[str]:
        nodes = []
        def walk(node: MockDOMNode):
            nodes.append(node.tag)
            for child in node.children:
                walk(child)
            for s in node.shadow:
                walk(s)
        walk(self.dom_root)
        return nodes

    def scrapeDeepLogs(self, selector: str) -> List[str]:
        return [line for line in self.logs if selector in line]

    def deployOmniHook(self):
        return {
            'fetch_proxied': self.omni.fetch('https://mock.endpoint/test'),
            'event_proxied': self.omni.add_event_listener('click', lambda: None),
            'frequency': {
                'fetch': self.omni.fetch_calls,
                'event': self.omni.event_calls
            }
        }

    def orchestratePipeline(self, selector: str):
        audit = {}
        audit['deployment'] = self.deployOmniHook()
        matched = findDeep(self.dom_root, selector)
        audit['matched'] = [n.tag for n in matched]
        audit['collision'] = auditCollision(matched)
        audit['lineage'] = traceLineage(self.dom_root)
        audit['logs'] = self.scrapeDeepLogs(selector)
        self.library.serialize(audit)
        return audit


if __name__ == '__main__':
    engine = MockDevEngine()

    print('=== Mock DevEngine Functional Test ===')
    print('listComponents:', engine.listComponents())
    print('scrapeDeepLogs(.line-content):', engine.scrapeDeepLogs('.line-content'))
    pipeline = engine.orchestratePipeline('line-content')
    print('orchestratePipeline result:', pipeline)
    assert pipeline['deployment']['frequency']['fetch'] == 1
    assert pipeline['deployment']['frequency']['event'] == 1
    assert 'line-content' in pipeline['logs'][0]
    assert pipeline['collision']['count'] >= 0
    assert 'body' in pipeline['lineage']
    print('serialized payloads:', engine.library.storage)
    print('All mock scenarios passed.')
