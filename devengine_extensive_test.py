import tomllib
from dataclasses import dataclass, field
from typing import Any, Dict, List


@dataclass
class MockDOMNode:
    tag: str
    id: str = ''
    classes: List[str] = field(default_factory=list)
    children: List['MockDOMNode'] = field(default_factory=list)
    shadow: List['MockDOMNode'] = field(default_factory=list)

    def find(self, selector: str) -> List['MockDOMNode']:
        matched = []
        if selector.strip() in {self.tag, f'#{self.id}'} or selector.strip() in self.classes:
            matched.append(self)
        for child in self.children:
            matched.extend(child.find(selector))
        for shadow_root in self.shadow:
            matched.extend(shadow_root.find(selector))
        return matched


class DevEngineScriptLibrary:
    def __init__(self, limit: int):
        self.storage: List[Dict[str, Any]] = []
        self.limit = limit

    def serialize(self, payload: Dict[str, Any]) -> None:
        if len(self.storage) >= self.limit:
            raise RuntimeError('DEVENGINE_SCRIPT_LIBRARY exceeded storage limit')
        self.storage.append(payload)


class OmniHook:
    def __init__(self, fetch_limit: int, event_limit: int):
        self.fetch_calls = 0
        self.event_calls = 0
        self.fetch_limit = fetch_limit
        self.event_limit = event_limit

    def fetch(self, url: str, **kwargs) -> Dict[str, Any]:
        if self.fetch_calls >= self.fetch_limit:
            raise RuntimeError('fetch call limit exceeded')
        self.fetch_calls += 1
        return {'url': url, 'status': 200, 'body': 'mocked'}

    def add_event_listener(self, event: str, callback: Any) -> Dict[str, Any]:
        if self.event_calls >= self.event_limit:
            raise RuntimeError('event listener limit exceeded')
        self.event_calls += 1
        return {'event': event, 'callback': callback}


def load_manifest(path: str = 'fortress_manifest.toml') -> Dict[str, int]:
    try:
        with open(path, 'rb') as f:
            config = tomllib.load(f)
        return config.get('resource_limits', {})
    except FileNotFoundError:
        return {}


def findDeep(node: MockDOMNode, selector: str, max_depth: int = 20, depth: int = 0) -> List[MockDOMNode]:
    if depth > max_depth:
        raise RecursionError('findDeep exceeded max recursion depth')
    matches = node.find(selector)
    return matches


def auditCollision(nodes: List[MockDOMNode]) -> Dict[str, Any]:
    return {
        'count': len(nodes),
        'issues': [n.tag for n in nodes if 'collision' in n.classes]
    }


def traceLineage(node: MockDOMNode, max_depth: int = 20, depth: int = 0) -> List[str]:
    if depth > max_depth:
        return ['<max depth exceeded>']
    lineage = [node.tag]
    for child in node.children:
        lineage.extend(traceLineage(child, max_depth, depth + 1))
    for shadow_root in node.shadow:
        lineage.extend(traceLineage(shadow_root, max_depth, depth + 1))
    return lineage


class MockDevEngine:
    def __init__(self, config: Dict[str, int]):
        self.config = config
        self.dom_root = MockDOMNode(
            tag='body',
            children=[
                MockDOMNode(tag='div', id='main', classes=['container'], children=[
                    MockDOMNode(tag='span', classes=['line-content', 'status']),
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
            '<div class="line-content">line A</div>',
            '<div class="line-content">line B</div>',
            '<div class="line-content">line C</div>'
        ]
        self.library = DevEngineScriptLibrary(self.config.get('max_serialization_records', 100))
        self.omni = OmniHook(
            self.config.get('max_fetch_calls_per_run', 10),
            self.config.get('max_event_listeners_per_run', 20)
        )

    def listComponents(self) -> List[str]:
        result: List[str] = []

        def walk(node: MockDOMNode):
            result.append(node.tag)
            for child in node.children:
                walk(child)
            for shadow_root in node.shadow:
                walk(shadow_root)

        walk(self.dom_root)
        return result

    def scrapeDeepLogs(self, selector: str) -> List[str]:
        return [line for line in self.logs if selector in line][:self.config.get('max_log_scrape_matches', 25)]

    def deployOmniHook(self) -> Dict[str, Any]:
        return {
            'fetch_proxied': self.omni.fetch('https://mock.endpoint/test'),
            'event_proxied': self.omni.add_event_listener('click', lambda: None),
            'frequency': {
                'fetch': self.omni.fetch_calls,
                'event': self.omni.event_calls
            }
        }

    def orchestratePipeline(self, selector: str) -> Dict[str, Any]:
        deployment = self.deployOmniHook()
        matched = findDeep(self.dom_root, selector, self.config.get('max_recursion_depth', 20))
        collision = auditCollision(matched)
        lineage = traceLineage(self.dom_root, self.config.get('max_recursion_depth', 20))
        logs = self.scrapeDeepLogs(selector)
        payload = {
            'deployment': deployment,
            'matched': [n.tag for n in matched],
            'collision': collision,
            'lineage': lineage,
            'logs': logs,
            'resource_snapshot': {
                'fetch_calls': self.omni.fetch_calls,
                'event_calls': self.omni.event_calls,
                'serialized_records': len(self.library.storage) + 1
            }
        }
        self.library.serialize(payload)
        return payload

    def stressRun(self, runs: int) -> Dict[str, Any]:
        report: Dict[str, Any] = {'runs': runs, 'errors': []}
        for i in range(runs):
            try:
                self.orchestratePipeline('line-content')
            except Exception as e:
                report['errors'].append({'run': i + 1, 'error': str(e)})
                break
        report['final_fetch_calls'] = self.omni.fetch_calls
        report['final_event_calls'] = self.omni.event_calls
        report['serialized'] = len(self.library.storage)
        return report


def run_tests() -> None:
    config = load_manifest()
    engine = MockDevEngine(config)
    print('\n=== Configuration and Stress Test Report ===\n')
    print('Resource limits loaded:', config)
    print('Component inventory:', engine.listComponents())
    print('Log scraping result:', engine.scrapeDeepLogs('line-content'))

    try:
        primary_output = engine.orchestratePipeline('line-content')
        print('Primary orchestration passed. Matched tags:', primary_output['matched'])
    except Exception as exc:
        print('Primary orchestration failed:', exc)

    try:
        deep_query = findDeep(engine.dom_root, 'shadow-item', config.get('max_recursion_depth', 20))
        print('Shadow DOM deep traversal found:', [node.tag for node in deep_query])
    except RecursionError as exc:
        print('Shadow DOM traversal failed:', exc)

    try:
        bad_depth = findDeep(engine.dom_root, 'shadow-item', 1)
        print('Bad depth traversal result (should be limited):', [node.tag for node in bad_depth])
    except RecursionError as exc:
        print('Bad depth traversal correctly raised:', exc)

    collision_test = auditCollision([MockDOMNode(tag='div', classes=['collision']), MockDOMNode(tag='span')])
    print('Collision detection test:', collision_test)

    try:
        stress = engine.stressRun(config.get('max_pipeline_runs', 50) + 5)
        print('Stress run summary:', stress)
    except Exception as exc:
        print('Stress scenario failed:', exc)

    print('\nPotential stress findings:')
    if stress['errors']:
        print('- Limit breach detected during stress run:', stress['errors'][0]['error'])
    else:
        print('- No limit breach detected under controlled stress. Increase configuration values for heavier load.')

    print('- The primary risk model includes: fetch/event throttle, lineage depth overflow, serialization saturation, and log matching bounds.')
    print('- Under real stress, invalid DOM selectors or deep shadow trees may surface recursion errors or incomplete capture.\n')


if __name__ == '__main__':
    run_tests()
